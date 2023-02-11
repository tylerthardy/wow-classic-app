export class HtmlCopyUtil {
  public static copyInputValueById(inputId: string) {
    var copyText: HTMLInputElement = document.getElementById(inputId) as HTMLInputElement;
    if (!copyText) {
      throw new Error('input field not found by id ${inputId}');
    }
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    copyText.setSelectionRange(0, 0);
    copyText.blur();
  }
}
