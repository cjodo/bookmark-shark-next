"use client"

import { 
	useActionState,
	useState
} from "react"



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


interface EmailVerificationFormProps {
	action: (prevState: {message: string }, formData: FormData) => Promise<{ message: string }>;
}
export const EmailVerificationForm = ({ action }: EmailVerificationFormProps) => {
	const [state, formAction] = useActionState(action, { message: "" });

	const router = useRouter();

	return (
		<form action={formAction}>
			<LoginContainer direction="column" justifyContent="space-between">
				<Container maxWidth="lg" className="flex flex-col items-center justify-center min-h-screen">
					<StyledCard variant="outlined">
						<Typography
							component="h1"
							variant="h4"
							sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
							className="text-5xl"
						>
							Verify Email
						</Typography>
							<FormControl>
								<FormLabel htmlFor="code">Code</FormLabel>
								<TextField
									id="code"
									type="text"
									name="code"
									autoFocus
									required
									fullWidth
									className="border p-2 rounded"
								/>
							</FormControl>
							{ /* <ForgotPassword open={open} handleClose={handleClose} /> */ } 
							{ state.message && <p>{state.message}</p> }
							<button
								type="submit"
								className="btn btn-secondary"
							>
								Verify
							</button>
					</StyledCard>
				</Container>
			</LoginContainer>
		</form>

	)
}
