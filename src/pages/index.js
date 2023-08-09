import axios from "axios";
import React, { useEffect, useState } from "react";
import ChatList from "@/components/ChatList";

const Home = () => {
  const [chatData, setChatData] = useState([]);

  const fetchChatData = () => {
    axios
      .get("https://my-json-server.typicode.com/codebuds-fk/chat/chats")
      .then((res) => setChatData(res.data))
      .catch((err) => console.log("error occured while fetching", err));
  };

  useEffect(() => {
    fetchChatData();
  }, []);

  return (
    <div className="min-h-screen w-screen bg-white overflow-y-hidden">
      <ChatList data={chatData} />
    </div>
  );
};

export default Home;
