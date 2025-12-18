"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import useCredsSignup from "@/hooks/auth/useCredsSignup";
import useCredsLogin from "@/hooks/auth/useCredsLogin";
import Link from "next/link";

type LoginOrSignupFormProps = {
  type: "login" | "signup";
};

export function LoginOrSignupForm({ type }: LoginOrSignupFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { mutateAsync: signup } = useCredsSignup();
  const { mutateAsync: login } = useCredsLogin();
  const keyword = type === "login" ? "Login" : "Sign Up";

  return (
    <div className="min-h-screen w-full flex items-center justify-center gap-20 p-8 flex-wrap-reverse">
      <div>
        <Image
          src="/instagram login image.png"
          alt="instagram"
          width={600}
          height={500}
        />
      </div>
      <div className="flex flex-col w-full max-w-sm">
        <h2 className="font-bold italic text-6xl text-center mb-4">Snapit</h2>
        <Card>
          <CardHeader>
            <CardTitle>{keyword} to your account</CardTitle>
            <CardDescription>
              {keyword} to start posting and connecting with others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field>
                  <Button
                    type="submit"
                    onClick={async (e) => {
                      e.preventDefault();
                      await (type === "login" ? login : signup)(formData);
                    }}
                  >
                    {keyword}
                  </Button>
                  <Button variant="outline" type="button">
                    Log in with Google
                  </Button>
                  <FieldDescription className="text-center">
                    {type === "login" ? (
                      <>
                        Don&apos;t have an account?{" "}
                        <Link href="/signup">Sign up</Link>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <Link href="/login">Login</Link>
                      </>
                    )}
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
