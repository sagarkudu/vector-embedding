- Spotify starts experimenting with transforming songs, artists and historical usage data into 'numerical vectors.'

These vectors capture the essense of the data going beyond genre labels or keywords. 
e.g "Happy" -> 0.09234242, 0.01987486, 0.05252523532, 0.0822522222...-> Joyful, Upbeat
e.g "All of me" -> 0.2324242, 0.025987486, 0.0252252523532, 0.9822522222...-> Wedding, Soulful

- Spotify revolutionalize its recommendation system with a process known as vector embeddings.

- Embeddings are building blocks of many machine learning and AI algorithms. If you need to buidling AI apps you need to learn embeddings and working with vector databases.

- What to expect:
 - Embeddings basics (use and its understanding)
 - create embeddings with Open AI API (Turn words, phrases into meaningful vector presentations)
 - Intro to vector databases.
 - setup and use vector database. (store embeddings)
 - AI driven search and conversations. (learn how AI powered chatbot and apps actually think, and replying like humans )
 - AI development framework LangChain (text splitting or chunking a crucial step in preparing text for vector embeddings)
 

 Q. What are embeddings?

 - when you present a question to AI, it first needs to translate it and format it so it can understand.
 So you can think embeddings as a language that AI understands.

 - The term embedding is a mathematical concept that refers to placing one object into a different space.
 Think of like taking a word or sentence which is a content space and transforming it into different representation like a set of numbers in a vector space, all while preserving its original message and the relationships between other words and phrases. 
 e.g "Hello world" -> 0.22234242, 0.436987486, 0.63252523532, 0.0345435322

 - AI systems process lots of data from user inputs to transform information and databases. At the heart of this processing are embeddings which are vectors represent that data. 

 Transforming content like search queries, photos, songs or videos into vectors gives machine power to effectivly compare categorize and understand the content in a way that's almost human.

- Think of vector as a coordinate or point in a space. Think of like X-Y axis and cat is translated into a vector e.g cat(4.5, 12.2). This vector encapsulates the meaning and naunces of the word cat in a way an AI model understand and then we word feline(4.7, 12.6) represented by a nearby vector of 4.7 and 12.6. So we will place that on the graph.
Now words that have similar meaning are numerically similar and tend to be closely positioned in the vector space. 
So this closeness implies that the cat and feline have the similar meaning. Now let's say we have a word or vectors for kitten(5.1, 12.1) which might be also be close to cat and feline, but may be slightly further apart due to its age related nuance. 

The dog(7.5, 10.5) is different but still in the same general domain of domesticated animals. So the word dog might be represented by a vector that's not too distant, but clearly in a different region. Lets say (7.5, 10.5) and even a phrase like man's best friend(7.6, 10.7), which is colloquial term for a dog could be represented by a vector that's close to the vector for dog. 
On the other hand the word like building is not related in meaning to any of these so its vector would be much further apart 

Supabase:
hEscowfnDfP8FRGN
https://fwosxzoihryeqckruogv.supabase.co

Text Embeddings:
- They are most popular form of embeddings and they are used to individual words or phrases and capture their semantics meaning based on their context.
- You learn embeddings is just a numerical snapshot of data. 

The core idea is  that a word, sentence or even entire documents can be reduced to a vector.

- Now as a developer it might be think like array of floating point numbers. [-0.323342334, -0.435223352, 0.0002342432432 ....]

- OpenAi has incredibly smart embedding model that creates text embeddings. You feed it some raw data and returns vector representations of your text that machine learning models and algorithms can easily consume.

- To create embeddings with OpenAI, we need to send text to the embeddings API endpoints along with embeddings models to use 

e.g
import openai from './config.js';

/** Create embeddings representing the input text */
async function main() {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002", //model id
    input: "Hello World",
  });
  console.log(embedding);
}
main();

output: The object that holds embedding as well as some response object that holds the embeddings as well as some information about the model and usage
{object: 'list', data: [{object: 'embedding', index: 0, embedding: [0.001563396, 0.0033545715, -0.012787512, -0.033411916, -0.009461612, 0.004733992, -0.0153806945, 0.0017139217, -0.0029770627, -0.024976106, 0.029792927, 0.007129659, -0.0168079, -0.018005734, 0.010391844, -0.0027222044, 0.025192736, -0.015074865, 0.011271105, 0.010793246, -0.008219178, -0.0017983434, 0.017139217, 0.00601784, -0.01431029, -0.0072698314, 0.003491558, -0.015915897, 0.037209302, -0.02577891, ...]}], model: 'text-embedding-ada-002-v2', usage: {prompt_tokens: 4, total_tokens: 4}}

Here data: [{...}] only contains embeddings 
- In this case, we have have one object in the array. Each embedding object has this object property set to string embedding 
- It also has the index of the embedding and most importantly embedding vector which is an array containing a list of floating point numbers 

- To get direct vector representation or translation of the text 'Hello World'.
console.log(embedding.data[0].embedding);

[0.0015191353, 0.0034491061, -0.012828254, -0.03340187, -0.009439658, 0.004748492, -0.0153760705, 0.0016051241, -0.0029602437, -0.024968598, 0.029936839, 0.0071020373, -0.016866542, -0.017974842, 0.010420567, -0.0027723424, 0.025146944, -0.015070332, 0.011305934, 0.010739045, -0.008216707, -0.0018296505, 0.017108586, 0.0059873676, -0.014280509, -0.0073440797, 0.0034968776, -0.015898373, 0.037198115, -0.025745682, ...]

- The length or dimension of the embedding is always 1536 for this particular model "text-embedding-ada-002". This means no matter the size of the input text there will be always 1536 numbers inside the array. 
 console.log(embedding.data[0].embedding.length);

 Although you may not seeing meaning in these numbers but they represent important semantic representation about the input text. Such high dimensionality is what provide AIs with a great degree of accuracy when it comes to searches, grouping by similarity, 

- Group of array

import openai from './config.js';

const content = [
  "Beyond Mars: speculating life on distant planets.",
  "Jazz under stars: a night in New Orleans' music scene.",
  "Mysteries of the deep: exploring uncharted ocean caves.",
  "Rediscovering lost melodies: the rebirth of vinyl culture.",
  "Tales from the tech frontier: decoding AI ethics.",
]; 

/** Create embeddings representing the input text */
async function main() {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: content,
  });
  console.log(embedding.data);
}
main();

output:
[{object: 'embedding', index: 0, embedding: [0.010850418, -0.0172835, -0.012959299, -0.018933348, -0.0084820865, 0.014941778, -0.021448039, -0.0062268497, -0.014329737, 0.010983471, 0.010531093, 0.018268086, -0.013810833, 0.0031849404, 0.0070783845, -0.0051990203, 0.029963387, -0.0027109415, 0.03360902, -0.0061802813, 0.023709927, -0.00020311272, 0.0069586374, -0.0034626871, 0.0024315317, 0.008315772, 0.023217633, -0.015939672, 0.0037886654, 0.002188711, ...]}, {object: 'embedding', index: 1, embedding: [0.002054754, -0.015002338, 0.0238009, -0.021706631, 0.011261632, 0.00641452, 0.0019049281, -0.0006779206, -0.025434166, -0.01106406, -0.0001673192, 0.0031973815, 0.0057822885, -0.01369836, -0.006947966, -0.027423061, 0.023063296, -0.013592987, 0.017320521, -0.022286177, -0.006457328, 0.008561474, 0.012914656, 0.0184401, 0.004050236, -0.0010850023, 0.011070645, -0.015911171, 0.009720567, 0.0053542145, ...]}, {object: 'embedding', index: 2, embedding: [0.024244562, -0.020896377, 0.017640831, -0.0113216285, -0.024787154, 0.011725263, -0.033031892, -0.012353875, -0.007999912, -0.0018874895, 0.012969253, 0.01862014, 0.00009847906, -0.020711103, 0.00033332963, -0.01134148, 0.024548942, -0.010732719, 0.016304204, -0.021187523, -0.0044035907, 0.014782301, 0.015708676, -0.010706251, -0.010798888, -0.014424985, 0.0003713772, -0.01858044, 0.008383696, -0.013710353, ...]}, {object: 'embedding', index: 3, embedding: [-0.013374321, -0.014049659, -0.0016328921, -0.01949208, -0.020352803, -0.00027249352, -0.0136126755, -0.009593758, -0.025768742, 0.0032806813, 0.010388272, 0.01844597, -0.0016726177, 0.008408608, -0.018459212, -0.0036349022, 0.03098605, 0.0139702065, 0.028284702, 0.007905415, -0.016909909, 0.0022180185, 0.0044658314, -0.0063031456, 0.0026715538, -0.010275716, 0.009421613, -0.018340034, 0.038401518, 0.014460157, ...]}, {object: 'embedding', index: 4, embedding: [0.008954449, -0.031208683, 0.021560092, -0.023128856, 0.008274188, 0.0146741895, -0.02242083, 0.02290673, -0.012626467, -0.034401745, 0.023642521, 0.020046858, 0.0059731035, -0.028737534, -0.0019939267, -0.009613885, 0.014285469, -0.006563125, 0.021782218, -0.01815879, -0.038039055, 0.02993146, -0.011960089, -0.000020241328, -0.0076008695, -0.0139036905, 0.021435145, -0.024350548, 0.0021848162, -0.016839918, ...]}]

So this function runs all of the text inputs through openAI embeddings models, then return a set of high dimensional vectors for each and in console you can see it has returns list of 5 objects each containing embedding array

# Vector Databases

- vector databases have the capacity to store and retrieve embeddings quickly and at scale.

How to vector databases work?

- Embeddings essentially allow us to match content to a question. Unlike traditional databases that search for exact values matches in a rows, vector db are powered by complex algorithms that stores, search and quickly identify vectors, So instead of looking for exact matches they use a similarity metric that uses all the information vectors provide the meaning of the words and phrases to find the vectors most similar to a given query. 

- So storing custom information as embeddings in a vector databases gives you the benefit of enabling users to interact with and perceive responses exclusively from your own content. You have complete control over your data, ensuring its remains relevant and up to date.

- Helps to reduce API calls and token usage. 

- This can also help reduce the numbers of calls and token usage, and even allow the summarization and storage of chat histories which helps AI maintain a type of long term memory. 

- Vast reduction in Hallucinations with AI models.

e.g Chroma, Pinecone, Supabase. 


# Semantic Search
Embeddings that are numberically similar or closer together are also sementically similar 

The query that actually finds and ranks embeddings based on their similarity or distance to query embedding.
PG vector supports operation for calculating distance, the operator used here is called cosine distance. 
Note that function name should match the table name exactly, here 'document' is table name.

```
-- Create a function to search for documents
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count; 
$$;
```

import { openai, supabase } from "./config.js";

// User query about podcasts
const query = "Frozen song in the sea";
main(query);

/*
  Create an embedding from the user input and return a 
  semantically matching text chunk from the database 
*/
async function main(input) {
  // Create a vector embedding representing the input text
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input,
  });

  // The vector generated by OpenAI
  const embedding = embeddingResponse.data[0].embedding;

  // Query Supabase for nearest vector match
  const { data } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 3,
  });
  // console.log(data);
  console.log(data[0].content, data[0].similarity);
}

output:
[
   {
     id: 12,
     content: 'Jazz under stars (55 min): Experience a captivating night in New Orleans, where jazz melodies echo under the moonlit sky.',
     similarity: 0.846741685465487
   },
   {
     id: 2,
     content: 'Jazz under stars (55 min): Experience a captivating night in New Orleans, where jazz melodies echo under the moonlit sky.',
     similarity: 0.846721768379236
   },
   {
     id: 4,
     content: 'Rediscovering lost melodies (48 min): Journey through time to explore the resurgence of vinyl culture and its timeless appeal.',
     similarity: 0.782044794315726
   }
 ]

Imagine how you might use this approach to search through a text document like research paper, legal contract, financial report or may be even tens or thousands of documents and quicky search surface information, ask questions, get summaries solely based on theri context.

Note: The above technique would be fine only if you searching podcast titles and descriptions.

# Create Conversational Response using openai.

we can acheive a more dynamic and conversation response by sending the matched text to OpenAI chat completions endpoint and instructing the model to formulate the specific answer.

The chat completions endpoint is designed to handle back and forth conversations. You just feed it some instructions and series of messages, and it returns an appropriate continuation of that conversation. 

e.g
// Use OpenAI to make the response conversational
const chatMessages = [{
    role: 'system',
    content: `You are an enthusiastic podcast expert who loves recommending podcasts to people. You will be given two pieces of information - some context about podcasts episodes and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.` 
}];

async function getChatCompletion(text, query) {
  chatMessages.push({
    role: 'user',
    content: `Context: ${text} Question: ${query}`
  });
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: chatMessages,
    temperature: 0.5,
    frequency_penalty: 0.5
  });

  console.log(response.choices[0].message.content);
}

we just transformed a simple database search into an engaging and informative conversation. So you can start to imagine the ways you can build AI driven apps that can generate responses taiored to your unique content. This allows users to essentially chat with your content.  

# Creating Text from Documents (Langchain)

1. Convert large document into small pieces of chunks to AI model can effectively capture and understand to give more accurate results.

2. Most text embeddings models including OpenAI have Tokens limits e.g the model "text-embedding-ada-002" is having token limit of 8191 maximum input tokens (rought 5000 english words.)
So smaller text chunks ensure we stay within the boundaries.

Effective chunking:
- It has quality data, so you should do a little bit of data pre-processing to ensure your content is free from unnecessary or irrelevant information.
- For example if you have sourced data from your various webpages that may often comes with extra like HTML tags, character entities, or miscellanous symbols that can affect the accuracy and effectiveness of your embeddings. 
- Correcting typos, removing any repeated text and standardizing text formatting helps ensure your data is in its best form. 

To chunk the text we can use library called 'langchain' which is commonly used for splitting text. One of those is called CharacterTextSplitter which splits based on specific characters and measures chunk length.
