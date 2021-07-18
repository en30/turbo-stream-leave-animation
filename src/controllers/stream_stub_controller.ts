import { Controller } from "stimulus";
import { renderStreamMessage } from "@hotwired/turbo";


export default class extends Controller {
  removeParent(event: MouseEvent) {
    const id = event.target.parentNode.id;
    renderStreamMessage(`
      <turbo-stream action="remove" target="${id}">
      </turbo-stream>
    `)
  }
}
