import * as morgan from "morgan";
import { Request, Response } from "express";

export const morganOptions: morgan.Options<Request, Response> = {
  stream: {
    write: (message: string) => {
      console.log(message.trim());
    },
  },
};

export const morganFormat: string = "dev";
