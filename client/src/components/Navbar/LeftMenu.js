import React from "react";
import { Button, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LeftMenu = ({ ...props }) => {
  const { t } = useTranslation();
  const navTo = useNavigate();

  const onClick = ({ key }) => {
    navTo(`${key}`);
  };

  const items = [
    {
      label: <span className=" blue-text">Modern Standard Arabic</span>,
      key: "/learn-arabic",
    },
    {
      label: <span className=" blue-text">Tunisian Arabic</span>,
      key: "/learn-tunisian-arabic",
    },
    {
      label: <span className=" blue-text">Libyan Arabic</span>,
      key: "/learn-libyan-arabic",
    },
    {
      label: <span className=" blue-text">French</span>,
      key: "/learn-french",
    },
    {
      label: <span className=" blue-text">English</span>,
      key: "/learn-english",
    },
  ];

  return (
    <>
      <Button
        type="link"
        className="ant-btn-menu"
        onClick={() => {
          navTo("/");
          props.setOpen(false);
        }}
      >
        {t("Home")}
      </Button>
      <Dropdown
        menu={{
          items,
          onClick,
        }}
      >
        <Button
          type="link"
          className="ant-btn-menu"
          onClick={() => {
            navTo("/language-courses");
            props.setOpen(false);
          }}
        >
          {t("LanguageCourses")}
        </Button>
      </Dropdown>
      <Button
        type="link"
        className="ant-btn-menu"
        onClick={() => {
          navTo("/student-life");
          props.setOpen(false);
        }}
      >
        {t("StudentLife")}
      </Button>
      <Button
        type="link"
        className="ant-btn-menu"
        onClick={() => {
          navTo("/about");
          props.setOpen(false);
        }}
      >
        {t("About")}
      </Button>{" "}
      <Button
        type="link"
        className="ant-btn-menu"
        onClick={() => {
          navTo("/contact");
          props.setOpen(false);
        }}
      >
        Contact
      </Button>
    </>
  );
};

export default LeftMenu;
