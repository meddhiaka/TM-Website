import React from "react";
import { WorkDesc } from "../../helpers/Constants";
import { Carousel, Image } from "antd";

export const Work = () => {
  const images = require.context("../../assets/images/student/Course/W", true);
  const imagesList = images.keys().map((image) => images(image));
  return (
    <div className="row">
      <h3 className="blue-text">Work & Research Experience </h3>
      <div className="mb-3 col-lg-7 col-md-12 col-sm-12 col-xs-12">
        {WorkDesc.map((d, index) => {
          return <p key={index}>{d.desc}</p>;
        })}
      </div>
      <div className="mb-3 col-lg-5 col-md-12 col-sm-12 col-xs-12">
        <Carousel autoplay speed={1500} slidesToShow={1} dots={false}>
          {imagesList.slice(2).map((i, index) => {
            return (
              <div className="px-3" key={index}>
                <Image src={i} alt="Taa Marbouta" className="rounded" />
              </div>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default Work;