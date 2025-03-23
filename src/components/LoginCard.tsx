"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import { 
	Box,
	Card,
	Checkbox,
	Container, 
	Divider,
	FormControl,
	FormControlLabel,
	FormLabel,
	Link,
	Stack,
	SvgIcon,
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


const LoginContainer = styled(Stack)(({ theme }) => ({
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


export const LoginCard = () => {
	const [emailError, setEmailError] = useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
	const [open, setOpen] = useState(false);

	const router = useRouter();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		if (emailError || passwordError) {
			event.preventDefault();
			return;
		}
		const data = new FormData(event.currentTarget);
		console.log({
			email: data.get('email'),
			password: data.get('password'),
		});
	};

	const validateInputs = () => {
		const email = document.getElementById('email') as HTMLInputElement;
		const password = document.getElementById('password') as HTMLInputElement;

		let isValid = true;

		if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
			setEmailError(true);
			setEmailErrorMessage('Please enter a valid email address.');
			isValid = false;
		} else {
			setEmailError(false);
			setEmailErrorMessage('');
		}

		if (!password.value || password.value.length < 6) {
			setPasswordError(true);
			setPasswordErrorMessage('Password must be at least 6 characters long.');
			isValid = false;
		} else {
			setPasswordError(false);
			setPasswordErrorMessage('');
		}

		return isValid;
	};

	return (
		<LoginContainer direction="column" justifyContent="space-between">
			<Container maxWidth="lg" className="flex flex-col items-center justify-center min-h-screen">
					<StyledCard variant="outlined">
						<Typography
							component="h1"
							variant="h4"
							sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
							className="text-5xl"
						>
							Sign in
						</Typography>
						<Box
							component="form"
							onSubmit={handleSubmit}
							noValidate
							sx={{
								display: 'flex',
								flexDirection: 'column',
								width: '100%',
								gap: 2,
							}}
						>
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
							<FormControlLabel
								control={<Checkbox value="remember" color="primary" />}
								label="Remember me"
							/>
							{ /* <ForgotPassword open={open} handleClose={handleClose} /> */ } 
							<button
								type="submit"
								onClick={validateInputs}
								className="btn btn-secondary"
							>
								Sign in
							</button>
							<Link
								component="button"
								type="button"
								onClick={handleClickOpen}
								variant="body2"
								sx={{ alignSelf: 'center' }}
							>
								Forgot your password?
							</Link>
						</Box>
						<Divider>or</Divider>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<button
								onClick={() => router.push("/login/google")}
								className="btn btn-primary"
							>
								Sign in with Google 
								{ <GoogleIcon /> }
							</button>
							<Typography sx={{ textAlign: 'center' }}>
								Don&apos;t have an account?{' '}
								<Link
									href="/sign-up"
									variant="body2"
									sx={{ alignSelf: 'center' }}
								>
									Sign up
								</Link>
							</Typography>
						</Box>
					</StyledCard>
			</Container>
		</LoginContainer>
	)
}
