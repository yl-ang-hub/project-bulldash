import React, { Suspense } from "react";
import {
  useQuery,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Badge } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const News = () => {
  const queryClient = useQueryClient();

  const fetchNewsData = async (category) => {
    const res = await fetch(
      `${import.meta.env.VITE_FINNHUB_API}/news?category=${category}&token=${import.meta.env.VITE_FINNHUB_APIKEY}`
    );
    if (!res.ok) {
      throw new Error("Request error");
    }
    console.log(res);
    const data = await res.json();
    console.log(JSON.stringify(data));
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
    <div className="container max-w-full mx-auto my-8 text-left">
      <div className="container my-10" id="top-news">
        <div>
          <h1 className="text-center !text-blue-400">Top News</h1>
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
                        <CardTitle className="mb-4">{news.headline}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{news.summary}</p>
                      </CardContent>
                    </Link>
                  </Card>
                </>
              );
            })}
          </div>
        </Suspense>
      </div>
      <div className="container my-10" id="crypto-news">
        <div>
          <h1 className="text-center !text-blue-400">Top Crypto News</h1>
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
                        <CardTitle className="mb-4">{news.headline}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{news.summary}</p>
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
