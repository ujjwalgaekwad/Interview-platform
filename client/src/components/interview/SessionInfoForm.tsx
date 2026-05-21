import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import SkillsInput from "./SkillsInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { jobRoleSchema, JobRoleType } from "@/types/InterviewData";
import { useNavigate } from "react-router-dom";
import useInterviewStore from "@/store/interviewStore";
import { useUser } from "@clerk/clerk-react";

const formSchema = z.object({
  yearsOfExperience: z
    .number()
    .min(0, "Experience must be a positive number")
    .max(50, "Experience cannot exceed 50 years"),
  jobRole: jobRoleSchema,
  skills: z.array(z.string()).nonempty("At least one skill is required"),
});

export type { formSchema }

function SessionInfoForm({ children, jobRole, skills }: { children: React.ReactNode, jobRole?: JobRoleType, skills?: string[] }) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: 0,
      jobRole: jobRole || "front-end",
      skills: skills || []
    }
  })

  const navigate = useNavigate()
  const { setCandidate } = useInterviewStore()

  const user = useUser().user

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setCandidate({
      id: user?.id || null,
      email: user?.primaryEmailAddress?.emailAddress || null,
      name: user?.username || null,
      yearsOfExperience: values.yearsOfExperience,
      jobRole: jobRole || values.jobRole,
      skills: skills || values.skills
    })
    navigate(`/interview/${Date.now()}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start session</DialogTitle>
          <DialogDescription>
            Fill the form below to start a new session
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role</FormLabel>
                  <FormControl>
                    <Select form="jobRole" value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobRoleSchema.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Years of Experience"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <SkillsInput value={field.value || []} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    Enter at least three skills
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default SessionInfoForm