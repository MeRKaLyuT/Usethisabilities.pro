import CardNav from './ui/header.module.jsx';
import logo from '../../../media/saturnwhite.png';
import React from 'react';
import { href } from 'react-router-dom';


export default function Header() {
  const items = [
    {
      label: "Главное",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "О нас", ariaLabel: "Home page", href: "/home" },
        { label: "FAQ", ariaLabel: "FAQ", href: "/faq" }
      ]
    },
    {
      label: "Курсы", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Каталог", ariaLabel: "Catalog", href: "/abilities" },
        { label: "Стать автором", ariaLabel: "Be author", href: "/abilities/author" }
      ]
    },
    {
      label: "Аккаунт",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Страница профиля", ariaLabel: "Profile", href: "/profile" },
        { label: "Настройки", ariaLabel: "Settings", href: "/settings" },
      ]
    }
  ];

  return (
    <CardNav
      logo={logo}
      logoAlt="Company Logo"
      items={items}
      baseColor="#451bdeff"
      menuColor="#ffffffff"
      buttonBgColor="#ffffffff"
      buttonTextColor="#000000ff"
      ease="circ.out"
    />
  );
};
