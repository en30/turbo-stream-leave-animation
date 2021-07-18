import "./style.css"
import "@hotwired/turbo"
import { Application } from "stimulus"
import LeaveAnimationController from "./controllers/leave_animation_controller"
import StreamStubController from "./controllers/stream_stub_controller"

const application = Application.start()
application.register("leave-animation", LeaveAnimationController)
application.register("stream-stub", StreamStubController)
