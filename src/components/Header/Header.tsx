import { ReactElement } from "react";
import Image from "next/image";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";

import { HeaderProps } from "./props";

import styles from "./styles.module.scss";

export default function Header({}: HeaderProps): ReactElement {
  const currentDate = format(new Date(), "EEEEEE, d MMMM", { locale: ptBR });

  return (
    <header className={styles.headerContainer}>
      <Image src="/logo.svg" alt="Podcastr" width={200} height={200} />

      <p>O melhor para você ouvir sempre</p>

      <span>{currentDate}</span>
    </header>
  );
}
