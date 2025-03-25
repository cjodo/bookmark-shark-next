"use client"

import { Star, StarBorder } from "@mui/icons-material"
import { useEffect, useState } from "react";

interface StarContainerParams {
	bookmarkId: number
	userId: number | undefined
}

export const StarContainer = ({ bookmarkId, userId }: StarContainerParams) => {
	const [amount, setAmount] = useState<number | null>(null);
	const [starred, setStarred] = useState(false);
	const[loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		// If userId exists, mark as logged in
		if (userId !== null) {
			setLoggedIn(true);
		}

		// Function to fetch the star count and check if the user has starred
		const fetchStarData = async () => {
			try {
				const res = await fetch(`/api/starcount?bookmarkId=${bookmarkId}&userId=${userId}`);
				const data = await res.json();

				// If the fetch was successful and contains data
				if (res.ok) {
					setAmount(data.starCount); // Set the star count
					setStarred(data.hasStarred); // Set if the user has starred the bookmark
				} else {
					console.error("Failed to fetch star count:", data.message);
				}
			} catch (error) {
				console.error("Error fetching star data:", error);
			}
		};

		if (userId !== null) {
			fetchStarData();
		}
	}, [bookmarkId, userId]);

	const unStar = async () => {
		if (!userId) return;

		const res = await fetch(`http://localhost:3000/api/unstar?bookmarkId=${bookmarkId}&userId=${userId}`, { method: "POST" });
		if (res.ok) {
			setStarred(false); // Update local state
			setAmount(prevAmount => (prevAmount ? prevAmount - 1 : 0)); // Decrease the amount
		}
	};

	const star = async () => {
		if (!userId) return;

		const res = await fetch(`http://localhost:3000/api/star?bookmarkId=${bookmarkId}&userId=${userId}`, { method: "POST" });
		if (res.ok) {
			setStarred(true); // Update local state
			setAmount(prevAmount => (prevAmount ? prevAmount + 1 : 1)); // Increase the amount
		}
	};

	if (!loggedIn) {
		return <a href="/login"><StarBorder /></a>;
	}

	return (
		<div className="flex flex-row gap-1">
			{amount !== null && <div className="amount">{amount}</div>}
			{starred ? (
				<button onClick={unStar}><Star /></button>
			) : (
					<button onClick={star}><StarBorder /></button>
				)}
		</div>
	);
}

