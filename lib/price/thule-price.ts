import { Show } from "../movie-data/cinemas/thule-types";

export default function thulePriceCalculation(show: Show):string{
    //const [date, time] = show.dttmShowStart.split('T')
    let price: number = -1;
    const dateTime = new Date(show.dttmShowStart);
    if(dateTime.getDay() == 0 || dateTime.getDay() == 6){
        price = 7
    } else if(dateTime.getDay() == 4){
        price = 4.50
    } else if(dateTime.getDay() <= 4 && dateTime.getHours() <= 17){
        price = 5.50
    } else {
        price = 7
    }
    if(price == -1){
        return "Hinda ei leitud"
    }
    return price + " €"
}