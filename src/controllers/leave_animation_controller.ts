import { Controller } from "stimulus";
import { StreamElement } from "@hotwired/turbo/dist/types/elements";

function nextAnimationFrame() {
  return new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
}

const DEFAULT_TRANSITION = "all 0s ease 0s"
const DEFAULT_ANIMATION = "none 0s ease 0s 1 normal none running"

export default class extends Controller {
  static classes = ["base", "active"]
  readonly baseClass!: string
  readonly activeClass!: string
  readonly hasActiveClass!: boolean

  connect() {
    document.addEventListener("turbo:before-stream-render", this.hook)
  }

  disconnect() {
    document.removeEventListener("turbo:before-stream-render", this.hook)
  }

  hook = async (e: CustomEvent) => {
    const stream = e.target as StreamElement;
    if (stream.action === "remove" && stream.targetElements.includes(this.element)) {
      e.preventDefault();
      await this.leaveAnimation();
      stream.performAction()
    }
  }

  leaveAnimation = () => new Promise<void>(resolve => {
    const activeClass = this.hasActiveClass ? this.activeClass : `${this.baseClass}-active`
    this.element.addEventListener('transitionend', (event) => {
      if (event.target === this.element) resolve()
    })
    this.element.addEventListener('animationend', (event) => {
      if (event.target === this.element) resolve()
    })
    this.element.classList.add(this.baseClass)
    const style = window.getComputedStyle(this.element)
    if (style.getPropertyValue("transition") === DEFAULT_TRANSITION && style.getPropertyValue("animation") === DEFAULT_ANIMATION) {
      console.warn("No leave animation style found", this.element)
      resolve()
    } else {
      nextAnimationFrame()
        .then(() => this.element.classList.add(activeClass))
    }
  })
}
