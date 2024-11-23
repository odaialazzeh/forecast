import React from "react";
import Image from "../Assets/cover-img.jpg";
import Search from "./Search";
const Banner = () => {
  return (
    <section className="h-full max-h-[640px] mb-8 xl:mb-24">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:ml-8 xl:ml-[135px] flex flex-col items-center lg:items-start text-center lg:text-left justify-center flex-1 px-4 lg:px-0">
          <h1 className="text-[32px] lg:text-[58px] font-semibold leading-none mb-6">
            <span className="text-primary">Three</span> Months Forecast
            <span className="text-primary"> Eighteen</span> Months Historical
            Performance
          </h1>
        </div>
        <div className="hidden flex-1 lg:flex justify-end items-end">
          <img src={Image} alt="" className="rounded-tl-[10rem] opacity-85" />
        </div>
      </div>
      <Search />
    </section>
  );
};

export default Banner;
