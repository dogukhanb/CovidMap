import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { headers } from "../constants";

export const getCountryData = createAsyncThunk(
  "covid/getCountryData",
  async ({ code }) => {
    const params = { iso: code };

    // gelen code 'a göre ülkenin covid bilgilerini al
    const req1 = axios.get(
      `https://covid-19-statistics.p.rapidapi.com/reports`,
      { params, headers }
    );

    //isocode'a göre ülkenin detaylarını alan isteği hazırla
    const req2 = axios.get(`https://restcountries.com/v3.1/alpha/${code}`);

    // iki api isteğinide aynı anda at
    const responses = await Promise.all([req1, req2]);

    //covid verilerinin içerisindeki region nesnesini  dağıt
    const covid = {
      ...responses[0].data.data[0],
      ...responses[0].data.data[0].region,
    };

    // gereksiz değerleri kaldır
    delete covid.region;
    delete covid.cities;

    // aksiyonun payload'ı
    return { covid, country: responses[1].data[0] };
  }
);
