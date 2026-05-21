import AnalysisComponent from "@/pages/Analysis";
import React, { useEffect, useState } from "react";
import Certificate from "../components/dashboard/Certificate";
import { useUser } from "@clerk/clerk-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { InterviewSessionData } from "@/types/InterviewData";
import { Loader2 } from "lucide-react";
import { IoMdArrowBack } from "react-icons/io";

const AnalyticsPage: React.FC = () => {

  const { id } = useParams();
  const location = useLocation()
  const navigate = useNavigate()
  const user = useUser().user

  const [analyticsData, setAnalyticsData] = useState<null | InterviewSessionData>(null)
  const [fetchingAnalyticsData, setFetchingAnalyticsData] = useState(true)

  const getAverageScore = () => {
    if (analyticsData) {
      const totalScore = analyticsData.questions.reduce((acc, question) => acc + question.score, 0);
      return Math.round(totalScore / analyticsData.questions.length);
    }
    return 0
  }

  useEffect(() => {
    const fetchSessionData = async () => {

      if (!fetchingAnalyticsData) {
        setFetchingAnalyticsData(true)
      }

      if (!id) {
        toast({
          title: location.pathname.includes("feedback") ? "Socket id not found" : "Object id not found",
          variant: "destructive"
        })
        navigate("/dashboard")
        return
      }

      try {
        let res;
        if (location.pathname.includes("feedback")) {
          res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/v1/sessions/data/${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        } else {
          res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/v1/sessions/history/${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        }

        if (res.status !== 200) {
          toast({
            title: "Something went wrong while fetching analytics data",
            variant: "destructive"
          })
          return
        }

        setAnalyticsData(res.data.response)

      } catch (error) {
        toast({
          title: "Something went wrong while fetching analytics data",
          variant: "destructive"
        })
        console.log(error)
      } finally {
        setFetchingAnalyticsData(false)
      }

    }
    fetchSessionData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-6">
      <Link to="/dashboard" className="text-3xl fixed top-8 left-8 h-12 w-12 flex justify-center items-center hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-full">
        <IoMdArrowBack />
      </Link>
      {fetchingAnalyticsData ?
        <div className="h-full w-full flex justify-center items-center">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        :
        <>
          <AnalysisComponent analyticsData={analyticsData} />
          {id ?
            <Certificate id={id} name={user?.fullName || "Not found"} role={"Mern stack"} score={getAverageScore() * 10} />
            :
            <div className="w-full h-96 flex justify-center items-center">
              <span>Certificate not found</span>
            </div>
          }
        </>}
    </div>
  );
};

export default AnalyticsPage;
