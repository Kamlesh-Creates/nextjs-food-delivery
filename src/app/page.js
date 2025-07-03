import Image from "next/image";
import styles from "./page.module.css";
import Customerheader from "./_component/customerheader";
import Restaurantfooter from "./_component/restaurantfooter";
import Homebanner from "./_component/homebanner";

export default function Home() {
  return (
    <main>
      <Customerheader />
      <div>
       
          <Homebanner  />
         
        
      </div>
      <Restaurantfooter />
    </main>
  );
}
