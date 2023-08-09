import isEmpty from "lodash/isEmpty";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ChatList = ({ data }) => {
  const [filteredChatData, setFilteredChatData] = useState(data);
  const [selectedChat, setSelectedChat] = useState();
  const [orderSearchInput, setOrderSearchInput] = useState();

  useEffect(() => {
    if (isEmpty(orderSearchInput) && !isEmpty(data)) {
      setFilteredChatData(data);
    } else {
      //Filter array

      const originalData = [...data];
      const filteredData = originalData.filter((chatItem) => {
        return (
          chatItem.orderId
            .toLowerCase()
            .includes(orderSearchInput.toLowerCase()) ||
          chatItem.title.toLowerCase().includes(orderSearchInput.toLowerCase())
        );
      });

      setFilteredChatData(filteredData);
    }
  }, [orderSearchInput, data]);

  const handleInputChange = (e) => {
    setOrderSearchInput(e.target.value);
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div>
      <div className="grid grid-cols-12">
        <div
          className={`${
            isEmpty(selectedChat)
              ? "col-span-12"
              : "col-span-6 overflow-y-scroll"
          }`}
        >
          <div className="p-4">
            <p className="text-lg font-bold mb-2">Filter by Title/Order ID</p>
            <div className="border-b border-black">
              <input
                type="text"
                onChange={handleInputChange}
                value={orderSearchInput}
                placeholder="Start typing to search"
                className="w-full border-none h-10"
              />
            </div>
          </div>
          {filteredChatData?.length <= 0 ? (
            <div className="">
              <p>No Results Found</p>
            </div>
          ) : (
            <>
              {filteredChatData.map((chat, index) => {
                const isLast = index === filteredChatData.length - 1;
                const isSelected = chat?.id === selectedChat?.id;
                return (
                  <div
                    onClick={() => handleChatClick(chat)}
                    key={chat.id}
                    className={`flex justify-between border-t border-gray-200 
                    p-2 ${isLast ? " border-b " : " pb-4"}
                    ${isSelected ? " bg-gray-200" : ""}
                    `}
                  >
                    <div className="flex ">
                      <Image
                        src={chat.imageURL}
                        width={50}
                        height={50}
                        alt={chat.title || ""}
                        style={{ aspectRatio: 1 }}
                        className={"!rounded"}
                        objectFit="contain"
                      />
                      <div className="ml-6">
                        <p className="mb-2 text-sm font-semibold">
                          {chat.title}
                        </p>
                        <p className="mb-3 text-sm font-semibold">
                          {chat.orderId}
                        </p>
                        <p className="text-sm text-gray-500">
                          {chat.messageList?.[0]?.message}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {moment(chat.latestMessageTimestamp).format(
                          "DD/MM/YYYY"
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        {!isEmpty(selectedChat) && (
          <div className="col-span-6 w-full h-full bg-gray-200 border border-gray-400 overflow-y-hidden relative">
            <div className="flex pl-10 py-4 bg-white items-center">
              <Image
                src={selectedChat?.imageURL}
                width={50}
                height={50}
                alt={selectedChat?.title || ""}
                style={{ aspectRatio: 1 }}
                className="!rounded"
                objectFit="contain"
              />
              <div className="ml-6">
                <p className="mb-2 text-lg font-bold">{selectedChat?.title}</p>
              </div>
            </div>
            <div className="w-full h-full">
              {isEmpty(selectedChat.messageList) ? (
                <div className="h-screen flex items-center justify-center">
                  <p>Start chatting</p>
                </div>
              ) : (
                <div className="mt-10">
                  {selectedChat.messageList.map((message) => (
                    <div className="flex flex-col" key={message.messageId}>
                      {message.sender === "BOT" ? (
                        message.messageType === "optionedMessage" ? (
                          <div className="flex flex-col ml-6 bg-white rounded-lg self-start w-fit overflow-hidden">
                            <p className="text-sm p-4 ">{message.message}</p>
                            {message.options.map((option, index) => {
                              const isLast =
                                index === message.options.length - 1;

                              return (
                                <div
                                  className={`bg-gray-100 py-3 text-blue-600 flex flex-col items-center justify-center ${
                                    isLast ? "" : " border-b border-gray-400"
                                  }`}
                                  key={index}
                                >
                                  <p className="text-sm text-blue-600 text-center ">
                                    {option.optionText}
                                  </p>
                                  {option?.optionSubText && (
                                    <p className="text-xs text-gray-600  text-center">
                                      {option.optionSubText}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-col ml-6 p-4 bg-white rounded-lg self-start w-fit">
                            <p className="text-sm ">{message.message}</p>
                            <p className=" mt-1 text-xs self-end w-fit ">
                              {moment(message.timestamp).format("hh:mm a")}
                            </p>
                          </div>
                        )
                      ) : (
                        <div className=" flex flex-col mr-6 p-4 bg-blue-500 rounded-lg self-end w-fit">
                          <p className="text-sm ">{message.message}</p>
                          <p className=" mt-1 text-xs self-end w-fit ">
                            {moment(message.timestamp).format("hh:mm a")}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 w-full">
              <input type="text" className="w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
