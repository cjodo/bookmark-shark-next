"use client";

import { ChangeEvent, useActionState, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { 
	Box, 
	Card, 
	Container, 
	Divider,
	FormControl, 
	FormLabel, 
	Stack, 
	TextField, 
	Typography,
	IconButton,
	} from "@mui/material";

import Image from "next/image";

import CloseIcon from "@mui/icons-material/Close"

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

export default function UpdateUserForm({ action, user }: UpdateUserFormParams) {
	const [nameError, setNameError] = useState(false);
	const [nameErrorMessage, setNameErrorMessage] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileErrorMessage, setFileErrorMessage] = useState<string>("");
	const [serverMessage, setServerMessage] = useState<string>("");
	const [preview, setPreview] = useState<string | null>(null);
	const router = useRouter();

	const [state, ] = useActionState(action, initialState);

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

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		console.log("file changed")
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			//2MB
			if(file.size  >  1024 * 1024){
				setFileErrorMessage("File cannot exceed 1mb");
				return 
			}
			setSelectedFile(file);
			setPreview(URL.createObjectURL(file)); // Immediately create the preview URL
			console.log(selectedFile);
		}
	};

	const clearFile = () => {
		setSelectedFile(null);
		setPreview(null);
	};

	const handleSubmit = async (e: FormEvent)=> {
		e.preventDefault();

		if (!validateInputs()) {
			return;
		}

		// Create FormData object to include the file and other data
		const formData = new FormData();
		formData.append("username", (document.getElementById("name") as HTMLInputElement).value);
		formData.append("email", (document.getElementById("email") as HTMLInputElement).value);
		formData.append("id", (document.getElementById("id") as HTMLInputElement).value);

		if (selectedFile) {
			formData.append("avatar", selectedFile);
		}

		// Call the action function with the FormData
		const result = await action(state, formData);
		if (result.message) {
			setServerMessage(result.message);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<UpdateContainer direction="column" justifyContent="center">
				<Container maxWidth="lg" className="flex flex-col items-center justify-center min-h-screen p-0">
					<StyledCard variant="outlined">
						<Typography component="h1" variant="h4" sx={{ fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
							Update Info
						</Typography>

						<FormLabel htmlFor="avatar">Change Avatar</FormLabel>
						<div className="flex items-center justify-center w-full">
							{preview ? (
								<div className="relative">
									<Image
										src={preview}
										alt="Avatar Preview"
										className="w-32 h-32 object-cover rounded-full border border-gray-300"
									/>
									<IconButton
										aria-label="remove avatar"
										onClick={clearFile}
										className="absolute -top-2 -right-2 bg-white"
									>
										<CloseIcon />
									</IconButton>
								</div>
							) : (
								<label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<svg
											className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 20 16"
										>
											<path
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
											/>
										</svg>
										<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
											<span className="font-semibold">Click to upload</span> or drag and drop
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
									</div>
										{fileErrorMessage &&<p className="text-red-600">{fileErrorMessage}</p> }
									<input id="avatar" name="avatar" type="file" className="hidden" onChange={handleFileChange} />
								</label>
							)}
						</div>

						<FormControl>
							<FormLabel htmlFor="name">Username</FormLabel>
							<TextField
								error={nameError}
								helperText={nameErrorMessage}
								name="username"
								value={user.username}
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
								value={user.email}
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
						{serverMessage && <p>{serverMessage}</p>}
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
				<FormControl>
					<input type="hidden" id="id" name="id" value={user.id} />
				</FormControl>
			</UpdateContainer>
		</form>
	);
}
