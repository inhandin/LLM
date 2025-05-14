import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const personalFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  avatar: z.string().optional(),
  job_title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  phone: z.string().optional(),
});

type PersonalFormValues = z.infer<typeof personalFormSchema>;

export const PersonalSettings = () => {
  const { toast } = useToast();
  
  const defaultValues: Partial<PersonalFormValues> = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
    job_title: "Product Manager",
    phone: "+1 (555) 123-4567",
  };

  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalFormSchema),
    defaultValues,
  });

  function onSubmit(data: PersonalFormValues) {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    console.log(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Profile</CardTitle>
        <CardDescription>
          Manage your personal information and account settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-6 space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-xl">JD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">Profile Picture</h3>
            <p className="text-sm text-muted-foreground mb-2">Upload a new avatar or profile picture.</p>
            <Button variant="outline" size="sm">Upload New</Button>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This email will be used for account notifications.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="job_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    For account recovery and notifications (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};