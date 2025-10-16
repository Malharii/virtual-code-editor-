import React from "react";

import { BsFiletypeTxt } from "react-icons/bs";
import { FaCss3, FaHtml5, FaJs } from "react-icons/fa";
import { GiInfo } from "react-icons/gi";
import { GrReactjs } from "react-icons/gr";
import { SiGitignoredotio, SiTypescript } from "react-icons/si";
import { VscJson } from "react-icons/vsc";

export const FileIcon = ({ extension }) => {
  const iconStyle = {
    height: "25px",
    width: "22px",
  };

  const iconMaper = {
    js: <FaJs color="#f7df1e" style={iconStyle} />,
    jsx: <GrReactjs color="#61DBFB" style={iconStyle} />,
    css: <FaCss3 color="#3c99dc" style={iconStyle} />,
    html: <FaHtml5 color="#e46d3bff" style={iconStyle} />,
    json: <VscJson color="#f7df1e" style={iconStyle} />,
    txt: <BsFiletypeTxt color="#f7df1e" style={iconStyle} />,
    ts: <SiTypescript color="blue" style={iconStyle} />,
    gitignore: <SiGitignoredotio color="#944c3dff" style={iconStyle} />,
    md: <GiInfo color="#61db7d" style={iconStyle} />,
  };
  return <>{iconMaper[extension]}</>;
};
