import { getCurrentSession } from "@/lib/session"
import UpdateUserForm from "@/components/UpdateUserForm";

import { updateProfileAction } from "./actions";

export default async function Page() {
	const { user, session } = await getCurrentSession();
	if (!session || !user) {
		return "Not Authenticated"
	}

	return (
		<UpdateUserForm action={ updateProfileAction } user={user} />
	)
}
