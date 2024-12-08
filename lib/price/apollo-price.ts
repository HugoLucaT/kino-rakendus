
import ageCalculation from "../age/age-calculation";
import { Show } from "../movie-data/cinemas/apollo-types";
import cocacolaPrice from "./apollo/cocacola-price";
import kristiinePrice from "./apollo/kristiine-price";
import narvaPrice from "./apollo/narva-price";
import othersPrice from "./apollo/others";
import solarisPrice from "./apollo/solaris-price";
import tallinnPrice from "./apollo/tallinn-price";
import tartuparnuPrice from "./apollo/tartu-parnu-price";



export default function apolloPriceCalculation(show: Show, supabaseData: any):string{
    let price: number = -1;
    let age = ageCalculation(supabaseData[0].user_data.birth_date)
    const dateTime = new Date(show.dttmShowStart);
    supabaseData.forEach(element => {
        if(element.membership_id == 1){
            age = 15
        }
    });

    if(show.Theatre == "Apollo Kino Astri"){
        price = narvaPrice(show, age)
    } else if (show.Theatre == "Apollo Kino Kristiine"){
        price = kristiinePrice(show, age)
    } else if (show.Theatre == "Apollo Kino Solaris"){
        price = solarisPrice(show, age)
    } else if (show.Theatre == "Apollo Kino Mustamäe" || show.Theatre == "Apollo Kino Ülemiste"){
        price = tallinnPrice(show, age)
    } else if (show.Theatre == "Apollo Kino Coca-Cola Plaza"){
        price = cocacolaPrice(show, age)
    } else if (show.Theatre == "Apollo Kino Lõunakeskus" || show.Theatre == "Apollo Kino Eeden" || show.Theatre == "Apollo Kino Tasku" || show.Theatre == "Apollo Kino Pärnu"){
        price = tartuparnuPrice(show, age)
    } else{
        price = othersPrice(show, age)

    }
    if(price == -1){
        return "Hinda ei leitud"
    }

    if(age > 12 && (!(dateTime.getDay() <= 5 && dateTime.getHours() < 17) || age < 65 || dateTime.getDay() == 0)){
        supabaseData.forEach(element => {
            if(element.membership_id == 4){
                price = price * 0.9
            }
        });
    }
    if(age <= 12){
        return Number(price.toFixed(2)) + " € (lastepilet)"
    }
    if(age <= 18){
        return Number(price.toFixed(2)) + " € (õpilasepilet/tudegipilet)"
    }
    if(age >= 65){
        return Number(price.toFixed(2)) + " € (pensionääri pilet)"
    }
    return Number(price.toFixed(2)) + " €"

}