import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Data {

}

export const POST = async (req: Request) => {
	try {
		const body: Data = req.json();

	} catch (error) {
		console.error("Error handling request", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}

}
