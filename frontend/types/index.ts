export type Source =
 { 
    document_name: string;
   page_number: number;
content: string;
 similarity_distance: number 
};
export type UploadedDocument = {
     document_id: string;
      document_name: string;
       chunks_created: number };
export type Message = {
     role: "user" | "assistant";
      content: string; 
      sources?: Source[]
    };
export type UploadResponse = { 
    message: string; 
    document_id: string;
     document_name: string; 
     pages: number; 
     chunks_created: number 
    };
export type DocumentsResponse = { 
    documents: UploadedDocument[] 
};
export type ChatResponse = {
     question: string; 
     answer: string; 
     sources: Source[] 
    };
