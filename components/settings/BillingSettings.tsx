import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CreditCard, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

export const BillingSettings = () => {
  const [plan, setPlan] = useState("pro");
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  const form = useForm({
    defaultValues: {
      payment_method: "card",
      plan: "pro",
    },
  });

  const plans = [
    {
      id: "starter",
      name: "Starter",
      description: "Up to 25,000 tokens daily",
      price: "$49/month",
    },
    {
      id: "pro",
      name: "Professional",
      description: "Up to 100,000 tokens daily",
      price: "$99/month",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Unlimited tokens",
      price: "$299/month",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            Manage your subscription and billing preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="plan"
                render={() => (
                  <FormItem>
                    <div className="space-y-4">
                      <RadioGroup 
                        defaultValue={plan} 
                        onValueChange={setPlan}
                        className="flex flex-col space-y-3"
                      >
                        {plans.map((planOption) => (
                          <div key={planOption.id} className={`flex items-center space-x-2 rounded-lg border p-4 ${plan === planOption.id ? 'border-primary' : 'border-border'}`}>
                            <RadioGroupItem value={planOption.id} id={planOption.id} />
                            <FormLabel htmlFor={planOption.id} className="flex-1 cursor-pointer flex justify-between">
                              <div>
                                <div className="font-semibold">{planOption.name}</div>
                                <div className="text-sm text-muted-foreground">{planOption.description}</div>
                              </div>
                              <div className="font-semibold">{planOption.price}</div>
                            </FormLabel>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button>Update Plan</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods and billing information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="payment_method"
                render={() => (
                  <FormItem>
                    <div className="space-y-4">
                      <RadioGroup 
                        defaultValue={paymentMethod} 
                        onValueChange={setPaymentMethod}
                        className="space-y-3"
                      >
                        <div className={`flex items-center space-x-2 rounded-lg border p-4 ${paymentMethod === 'card' ? 'border-primary' : 'border-border'}`}>
                          <RadioGroupItem value="card" id="card" />
                          <FormLabel htmlFor="card" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">Credit/Debit Card</div>
                                <div className="text-sm text-muted-foreground">•••• •••• •••• 4242</div>
                              </div>
                              <CreditCard className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </FormLabel>
                        </div>
                        <div className={`flex items-center space-x-2 rounded-lg border p-4 ${paymentMethod === 'bank' ? 'border-primary' : 'border-border'}`}>
                          <RadioGroupItem value="bank" id="bank" />
                          <FormLabel htmlFor="bank" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">Bank Account (ACH)</div>
                                <div className="text-sm text-muted-foreground">Bank of America •••• 7890</div>
                              </div>
                              <DollarSign className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </FormLabel>
                        </div>
                      </RadioGroup>

                      <Button variant="outline" className="mt-4">
                        Add Payment Method
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Update your billing address and information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." defaultValue="Acme AI Solutions" />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Tax ID / VAT Number</FormLabel>
                  <FormControl>
                    <Input placeholder="XX-XXXXXXX" defaultValue="US-87654321" />
                  </FormControl>
                </FormItem>
              </div>
              
              <FormItem>
                <FormLabel>Billing Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="billing@example.com" defaultValue="billing@acme-ai.example.com" />
                </FormControl>
                <FormDescription>
                  Invoices will be sent to this email address.
                </FormDescription>
              </FormItem>
              
              <FormItem>
                <FormLabel>Billing Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street Address" defaultValue="123 Tech Lane" />
                </FormControl>
              </FormItem>

              <div className="grid gap-4 grid-cols-2">
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" defaultValue="San Francisco" />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>State / Province</FormLabel>
                  <FormControl>
                    <Input placeholder="State / Province" defaultValue="California" />
                  </FormControl>
                </FormItem>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Postal Code" defaultValue="94103" />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select defaultValue="us">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button>Save Billing Information</Button>
        </CardFooter>
      </Card>
    </div>
  );
};