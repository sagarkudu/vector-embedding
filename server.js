import fs from "fs/promises";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

async function splitDocument() {
  try {
    // Read local text file
    const text = await fs.readFile("./long-podcasts.txt", "utf-8");

    // Create splitter
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    // Split document
    const docs = await splitter.createDocuments([text]);

    console.log("Total chunks:", docs.length);

    console.log(docs[0]);
  } catch (error) {
    console.error(error);
  }
}

splitDocument();
