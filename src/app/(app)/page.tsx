"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12 ">
        <h1 className="text-4xl mb:text-5xl font-bold">
          Dive into the World of Anonymous Conversations
        </h1>
        <p className="mt-4 md:mt-6 text-base md:text-lg">
          Explore Mystery Message - Where your identity remains a secret.
        </p>
      </section>

      <Carousel
        plugins={[Autoplay({ delay: 3000 })]}
        className="w-full max-w-xs"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  {/* <CardHeader>{message.title}</CardHeader> */}
                  <CardContent className="flex aspect-auto items-center justify-center p-6">
                    <span className="text-lg font-semibold">
                      {message.content}
                    </span>
                  </CardContent>
                  <CardHeader>{message.received}</CardHeader>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </main>
  );
}
