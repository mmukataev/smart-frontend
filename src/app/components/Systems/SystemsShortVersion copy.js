"use client";

import React from "react";
import Slider from "react-slick";

import Systems from "@/translations/systems";
import { useLocale } from "@/hooks/useLocale";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SystemsShortVersion() {
  const locale = useLocale();

  const settings = {
    dots: false,
    infinite: true,
    vertical: true,
    verticalSwiping: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 800,
  };

  return (
    <div className="overflow-hidden my-auto">
      <Slider {...settings}>
        {Object.entries(Systems).map(([id, system]) => (
          <div key={id} className="!grid grid-cols-[50px_1fr] gap-[10px] rounded-[5px] p-[10px] bg-white hover:shadow mb-[10px]">
            <div className="flex items-center justify-center mr-[5px] w-[50px] h-[50px] bg-[#F9F9F9] rounded-[5px]">
                <img src={`/icons/${system.icon}`} className="w-[24px] h-[24px]" />
            </div>
            <div className="">
                <h4 className="text-[14px] font-semibold">{system.name[locale]}</h4>
                <p className="text-[12px] text-gray-600 mb-2">{system.shortdescription[locale]}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
