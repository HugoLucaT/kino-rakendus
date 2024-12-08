import { Show } from "../../movie-data/cinemas/apollo-types";

export default function tallinnPrice(show: Show):number{
    let price: number = -1;
    const dateTime = new Date(show.dttmShowStart);
    if(dateTime.getDay() == 0){
        price = 9.99
    } else if(dateTime.getDay() <= 5 && dateTime.getHours() < 17){
        price = 8.10
    } else if(dateTime.getDay() <= 4 && dateTime.getHours() >= 17){
        price = 9.21
    } else {
        price = 9.99
    }
    if(show.PresentationMethod == "3D"){
        price += 1
    }
    if(show.TheatreAuditorium == "3. Apollo Kinorestoran"){
        price += 2
    }
    return price
}