import { EntityTypes, imageExtensions } from "../constants";

export class CommonHelper {
  assignValues(target: Record<string, any>, source: Record<string, any>) {
    for (const key in source) {
      if (source?.hasOwnProperty(key)) {
        const value = source[key];
        if (
          value !== undefined &&
          value !== null &&
          !(typeof value === "string" && value.trim() === "") &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          target[key] = value;
        }
      }
    }
    return target;
  }

  parseBody(body: any) {
    const parsedBody: Record<string, any> = {};

    Object.keys(body).forEach((key) => {
      let parsedValue;
      try {
        parsedValue = JSON.parse(body[key]);
      } catch (error) {
        parsedValue = body[key];
      }
      parsedBody[key] = parsedValue;
    });
    return parsedBody;
  }

  getFileType(fileName: string) {
    const fileExtension = fileName
      .substring(fileName.lastIndexOf("."))
      .toLowerCase();

    if (imageExtensions.includes(fileExtension)) {
      return "image";
    } else {
      return "unknown";
    }
  }

  getDateAfter24Hours() {
    const currentDate = new Date();
    return new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  getDateAfterDays(days: number = 1) {
    const currentDate = new Date();
    return new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
  }
}

export const commonHelper = new CommonHelper();
