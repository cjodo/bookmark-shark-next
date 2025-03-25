import formidable from "formidable";
import { getCurrentSessionFromRequest } from "@/lib/session";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { user } = await getCurrentSessionFromRequest(req);

  if (!user) {
    return new Response("Forbidden", { status: 401 });
  }

  const uploadDir = path.join(process.cwd(), "public/avatars");

  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
    multiples: false,
  });

  // Return a promise to handle async code
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return reject(new Response("Error processing file upload", { status: 500 }));
      }

      if (!files || !files.avatar) {
        return reject(new Response("No valid file uploaded", { status: 400 }));
      }

      const file = files.avatar as unknown as File;
      const ext = file.name.split(".").pop();
      const fileName = `${user.id}.${ext}`;
      const avatarPath = `/avatars/${fileName}`;

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(uploadDir, fileName);

        await fs.promises.writeFile(filePath, buffer);

        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { avatar: avatarPath },
        });

				console.log("Updates: ", updatedUser);

        resolve(new Response("Success", { status: 200 }));
      } catch (err) {
        console.error("Error saving file:", err);
        reject(new Response("Internal Server Error", { status: 500 }));
      }
    });
  });
}

