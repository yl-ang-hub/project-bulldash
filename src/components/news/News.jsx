import React, { Suspense } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const News = () => {
  const queryClient = useQueryClient();

  const fetchNewsData = async (category) => {
    const res = await fetch(
      `${import.meta.env.VITE_FINNHUB_APIURL}/news?category=${category}&token=${import.meta.env.VITE_FINNHUB_APIKEY}`
    );
    if (!res.ok) {
      throw new Error("Request error");
    }
    const data = await res.json();
    return data;
  };

  const qCoinNews = useSuspenseQuery({
    queryKey: ["qCoinNews"],
    queryFn: () => fetchNewsData("crypto"),
  });

  const qGeneralNews = useSuspenseQuery({
    queryKey: ["qGeneralNews"],
    queryFn: () => fetchNewsData("general"),
  });

  return (
    <div className="h-screen grid grid-cols-1 place-items-center max-w-full mx-auto my-8 text-left">
      <div id="top-news">
        <div>
          <h1 className="my-10 text-center text-4xl font-bold text-blue-600 dark:text-white">
            Top News
          </h1>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <div className="container">
            {qGeneralNews.data?.slice(0, 20).map((news, idx) => {
              return (
                <>
                  <Card
                    className="w-[700px] h-full my-3 mx-auto justify-self-center shadow-md rounded-lg overflow-hidden transition-all ease-in-out duration-300 hover:shadow-xl"
                    key={idx}
                  >
                    <Link to={news.url} className="text-black !no-underline">
                      <CardHeader>
                        <CardTitle className="mb-4 text-lg/6">
                          <p>{news.headline}</p>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-500">{news.summary}</p>
                      </CardContent>
                    </Link>
                  </Card>
                </>
              );
            })}
          </div>
        </Suspense>
      </div>
      <div id="crypto-news">
        <div>
          <div className="my-10 text-center text-4xl font-bold text-blue-600 dark:text-white">
            Top Crypto News
          </div>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <div className="container">
            {qCoinNews.data?.slice(0, 20).map((news, idx) => {
              return (
                <>
                  <Card
                    className="w-[700px] h-full my-3 mx-auto justify-self-center shadow-md rounded-lg overflow-hidden transition-all ease-in-out duration-300 hover:shadow-xl"
                    key={idx}
                  >
                    <Link to={news.url} className="text-black !no-underline">
                      <CardHeader>
                        <CardTitle className="mb-4 text-lg/6">
                          <p>{news.headline}</p>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-500">{news.summary}</p>
                      </CardContent>
                    </Link>
                  </Card>
                </>
              );
            })}
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default News;
