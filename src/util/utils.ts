export class Utils {
  public static unixTimestampNow() {
    return Math.floor(new Date().getTime() / 1000);
  }
}