"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useAddUsername from "@/hooks/firestore/useAddUsername";
import useCheckUsername from "@/hooks/firestore/useCheckUsername";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const USERNAME_REGEX = /^[a-zA-Z0-9.-_]+$/;

const SetUsername = () => {
  const [username, setUsername] = useState<string | undefined>("");

  const { mutateAsync: createUser } = useAddUsername();
  const router = useRouter();

  const { data: isTaken, isFetching } = useCheckUsername(username);

  const error = useMemo(() => {
    if (!username) return "Username is required";
    else if (!USERNAME_REGEX.test(username))
      return "Only letters, numbers, ., -, _ are allowed";
    else if (username.length < 3)
      return "Username must be at least 3 characters";
    else if (isTaken) return "Username already taken";
    else return null;
  }, [username, isTaken]);

  const handleCreate = async () => {
    if (error || !username) return;
    await createUser(username);
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-5xl font-bold">Set Username</CardTitle>
          <CardDescription className="text-2xl">
            Choose your username
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={username}
            placeholder="Type username"
            onChange={(e) => setUsername(e.target.value)}
          />
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          {isFetching && (
            <p className="text-sm text-muted-foreground">
              Checking availability...
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCreate}
            disabled={!!error || isFetching}
            className="cursor-pointer"
          >
            Create
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetUsername;
