

import SignUpCard from "@/components/SignUpCard"

import { SignUpAction } from "./action"

export default function Page() {

	return (
		<div className="min-h-screen">
				<SignUpCard action={SignUpAction}/>
		</div>
	)
}
