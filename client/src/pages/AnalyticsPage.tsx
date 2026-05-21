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
import Container from "@/components/general/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyticsPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser().user;

  const [analyticsData, setAnalyticsData] = useState<null | InterviewSessionData>(null);
  const [fetchingAnalyticsData, setFetchingAnalyticsData] = useState(true);

  const getAverageScore = () => {
    if (!analyticsData) return 0;

    const totalScore = analyticsData.questions.reduce((acc, question) => acc + question.score, 0);
    return Math.round(totalScore / analyticsData.questions.length);
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!fetchingAnalyticsData) {
        setFetchingAnalyticsData(true);
      }

      if (!id) {
        toast({
          title: location.pathname.includes("feedback") ? "Socket id not found" : "Object id not found",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      try {
        let res;

        if (location.pathname.includes("feedback")) {
          res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/v1/sessions/data/${id}`, {
            headers: { "Content-Type": "application/json" },
          });
        } else {
          res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/v1/sessions/history/${id}`, {
            headers: { "Content-Type": "application/json" },
          });
        }

        if (res.status !== 200) {
          toast({
            title: "Something went wrong while fetching analytics data",
            variant: "destructive",
          });
          return;
        }

        setAnalyticsData(res.data.response);
      } catch (error) {
        toast({
          title: "Something went wrong while fetching analytics data",
          variant: "destructive",
        });
        console.log(error);
      } finally {
        setFetchingAnalyticsData(false);
      }
    };

    fetchSessionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-section py-8">
      <Container className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 text-sm font-semibold text-foreground backdrop-blur-sm"
          >
            <IoMdArrowBack />
            Back to dashboard
          </Link>
          <span className="section-kicker">Session analysis</span>
        </div>

        {fetchingAnalyticsData ? (
          <Card className="surface-panel">
            <CardContent className="flex min-h-[50vh] items-center justify-center gap-3 p-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="font-medium">Loading analytics...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card className="surface-panel overflow-hidden">
              <CardHeader className="border-b border-border/60 bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="text-2xl">Interview feedback</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AnalysisComponent analyticsData={analyticsData} />
              </CardContent>
            </Card>

            {id ? (
              <Certificate id={id} name={user?.fullName || "Not found"} role={"Mern stack"} score={getAverageScore() * 10} />
            ) : (
              <Card className="surface-panel">
                <CardContent className="flex min-h-80 items-center justify-center text-muted-foreground">
                  Certificate not found
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default AnalyticsPage;