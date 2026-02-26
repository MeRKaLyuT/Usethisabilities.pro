import CardNav from './ui/header.module.jsx';
import logo from '../../../media/saturnwhite.png';
import React from 'react';


export default function Header() {
  const items = [
    {
      label: "Главное",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Главная", ariaLabel: "Главная страница", href: "/" },
        
      ]
    },
    {
      label: "Курсы", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Каталог", ariaLabel: "Каталог курсов", href: "/abilities" },
        { label: "Роадмапы", ariaLabel: "Роадмапы", href: "/roadmaps" }
      ]
    },
    {
      label: "Аккаунт",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Профиль", ariaLabel: "Профиль", href: "/profile" },
      ]
    }
  ];

  return (
    <CardNav
      logo={logo}
      logoAlt="Логотип компании"
      items={items}
      baseColor="#451bdeff"
      menuColor="#ffffffff"
      buttonBgColor="#ffffffff"
      buttonTextColor="#000000ff"
      ease="circ.out"
    />
  );
};
