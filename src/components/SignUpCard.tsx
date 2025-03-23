"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useActionState } from "react";

import { 
	Box,
	Card,
	Container, 
	Divider,
	FormControl,
	FormLabel,
	Stack,
	TextField,
	Typography
} from "@mui/material";

import { styled } from "@mui/material";

import { GoogleIcon } from "./icons";

const StyledCard = styled(Card)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignSelf: 'center',
	width: '100%',
	padding: theme.spacing(4),
	gap: theme.spacing(2),
	margin: 'auto',
	[theme.breakpoints.up('sm')]: {
		maxWidth: '450px',
	},
	boxShadow:
	'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
	...theme.applyStyles('dark', {
		boxShadow:
		'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
	}),
}));


const SignupContainer = styled(Stack)(({ theme }) => ({
	height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
	minHeight: '100%',
	padding: theme.spacing(2),
	[theme.breakpoints.up('sm')]: {
		padding: theme.spacing(4),
	},
	'&::before': {
		content: '""',
		display: 'block',
		position: 'absolute',
		zIndex: -1,
		inset: 0,
		backgroundImage:
		'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
		backgroundRepeat: 'no-repeat',
		...theme.applyStyles('dark', {
			backgroundImage:
			'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
		}),
	},
}));


interface SignUpParams {
	action: (prevState: {message: string }, formData: FormData) => Promise<{ message: string }>;
}
export default function SignUpCard({ action }: SignUpParams) {
	const [emailError, setEmailError] = useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
	const [usernameError, setUsernameError] = useState(false);
	const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
	const [state, formAction] = useActionState(action, {message: ""})

	const router = useRouter();

	const validateInputs = () => {
		const username = document.getElementById('username') as HTMLInputElement;
		const email = document.getElementById('email') as HTMLInputElement;
		const password = document.getElementById('password') as HTMLInputElement;
		const confirm = document.getElementById('confirm') as HTMLInputElement;

		let isValid = true;


		if(username.value === "") {
			setUsernameError(true);
			setUsernameErrorMessage('You must enter a username');
			isValid = false;
		} else if(username.value.trim() !== username.value || username.value.split(" ").length !== 1) {
			//TODO: Innapropriate names?
			setUsernameError(true);
			setUsernameErrorMessage('Username cannot contain any spaces');
			isValid = false;
		} else if (username.value.length < 6) {
			setUsernameError(true);
			setUsernameErrorMessage('Username must be at least 6 characters');
			isValid = false;
		} else if (username.value.length > 20) {
			setUsernameError(true);
			setUsernameErrorMessage('Username must be under 20 characters');
			isValid = false;
		}

		if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
			setEmailError(true);
			setEmailErrorMessage('Please enter a valid email address.');
			isValid = false;
		} else {
			setEmailError(false);
			setEmailErrorMessage('');
		}

		if (!password.value || password.value.length < 6 ) {
			setPasswordError(true);
			setPasswordErrorMessage('Password must be at least 6 characters long.');
			isValid = false;
		} else if (password.value !== confirm.value){
			setPasswordError(true);
			setPasswordErrorMessage("Passwords don't match");
			isValid = false;
		} else {
			setPasswordError(false);
			setPasswordErrorMessage('');
		}

		return isValid;
	};

	return (
		<form action={formAction}>
			<SignupContainer direction="column" justifyContent="space-between">
				<Container maxWidth="lg" className="flex flex-col items-center justify-center min-h-screen p-0">
					<StyledCard variant="outlined">
						<Typography
							component="h1"
							variant="h4"
							sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
							className="text-5xl"
						>
							Sign up
						</Typography>
						<FormControl>
							<FormLabel htmlFor="username">Username</FormLabel>
							<TextField
								error={usernameError}
								helperText={usernameErrorMessage}
								name="username"
								placeholder="john-doe"
								type="text"
								id="username"
								autoFocus
								required
								fullWidth
								variant="outlined"
								color={usernameError ? 'error' : 'primary'}
								className="border p-2 rounded"
							/>
						</FormControl>
						<FormControl>
							<FormLabel htmlFor="email">Email</FormLabel>
							<TextField
								error={emailError}
								helperText={emailErrorMessage}
								id="email"
								type="email"
								name="email"
								placeholder="your@email.com"
								autoComplete="email"
								autoFocus
								required
								fullWidth
								color={emailError ? 'error' : 'primary'}
								className="border p-2 rounded"
							/>
						</FormControl>
						<FormControl>
							<FormLabel htmlFor="password">Password</FormLabel>
							<TextField
								error={passwordError}
								helperText={passwordErrorMessage}
								name="password"
								placeholder="••••••"
								type="password"
								id="password"
								autoComplete="current-password"
								autoFocus
								required
								fullWidth
								variant="outlined"
								color={passwordError ? 'error' : 'primary'}
								className="border p-2 rounded"
							/>
						</FormControl>
						<FormControl>
							<FormLabel htmlFor="confirm">Confirm Password</FormLabel>
							<TextField
								error={passwordError}
								helperText={passwordErrorMessage}
								name="confirm"
								placeholder="••••••"
								type="password"
								id="confirm"
								autoComplete="current-password"
								autoFocus
								required
								fullWidth
								variant="outlined"
								color={passwordError ? 'error' : 'primary'}
								className="border p-2 rounded"
							/>
						</FormControl>
						{ /* <ForgotPassword open={open} handleClose={handleClose} /> */ } 
						{state.message && <p className="text-red-600">{state.message}</p>}
						<button
							type="submit"
							onClick={validateInputs}
							className="btn btn-secondary"
						>
							Sign up
						</button>
						<Divider>or</Divider>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<button
								onClick={() => router.push("/login/google")}
								className="btn btn-primary"
							>
								Sign In with Google 
								{ <GoogleIcon /> }
							</button>
						</Box>
					</StyledCard>
				</Container>
			</SignupContainer>
		</form>
	)
}
