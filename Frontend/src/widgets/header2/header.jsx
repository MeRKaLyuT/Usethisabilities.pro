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
        { label: "Главная", ariaLabel: "Home page", href: "/" },
        
      ]
    },
    {
      label: "Курсы", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Каталог", ariaLabel: "Catalog", href: "/abilities" },
        { label: "Роадмапы", ariaLabel: "Be author", href: "/roadmaps" }
      ]
    },
    {
      label: "Аккаунт",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Профиль", ariaLabel: "Profile", href: "/profile" },
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
