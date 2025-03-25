"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Card, Container, FormControl, FormLabel, Stack, TextField, Typography, Divider } from "@mui/material";
import { styled } from "@mui/material";
import { User } from "@prisma/client";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const UpdateContainer = styled(Stack)(({ theme }) => ({
  height: "100dvh",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

const initialState = {
	message: ""
}

interface UpdateUserFormParams {
	action: (prevState: {message: string}, formData: FormData) => Promise<{message: string}>;
	user: Partial<User> | User
}
export default function UpdateUserForm({ action }: UpdateUserFormParams) {
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const router = useRouter();

	const[state, formAction] = useActionState(action, initialState);

  const validateInputs = () => {
    const name = document.getElementById("name") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    let isValid = true;

    if (!name.value.trim()) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Enter a valid email.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    return isValid;
  };

  return (
    <form action={formAction}>
      <UpdateContainer direction="column" justifyContent="center">
        <Container maxWidth="lg" className="flex flex-col items-center justify-center min-h-screen p-0">
          <StyledCard variant="outlined">
            <Typography component="h1" variant="h4" sx={{ fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
              Update Info
            </Typography>
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <TextField
                error={nameError}
                helperText={nameErrorMessage}
                name="name"
                placeholder="John Doe"
                type="text"
                id="name"
                required
                fullWidth
								variant="outlined"
								className="p-2 border rounded"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                name="email"
                placeholder="your@email.com"
                type="email"
                id="email"
                required
                fullWidth
								variant="outlined"
								className="p-2 border rounded"
              />
            </FormControl>
						{ state.message && <p>{state.message}</p> }
            <button type="submit" onClick={validateInputs} className="btn btn-secondary">
              Update
            </button>
            <Divider>or</Divider>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <button type="button" onClick={() => router.push("/")} className="btn btn-primary">
                Cancel
              </button>
            </Box>
          </StyledCard>
        </Container>
      </UpdateContainer>
    </form>
  );
}

