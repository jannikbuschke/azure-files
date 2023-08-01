module AzFiles.Features.GetNavbar

open AzFiles
open AzFiles
open Glow.Core.Actions
open MediatR
open Microsoft.Extensions.Configuration

[<CLIMutable>]
type Message = { Title: string; Color: string }

type Navbar = { Message: Message option }

[<Action(Route = "api/get-navbar", Policy = Policies.AuthenticatedUser)>]
type GetNavbar() =
  interface IRequest<Navbar>

type GetNavbarHandler(session: IWebRequestContext) =
  interface IRequestHandler<GetNavbar, Navbar> with
    member this.Handle(request, token) =
      task {
        let navbarMessage =
          session
            .Configuration
            .GetSection("NavbarMessage")
            .Get<Message>()

        let msg =
          if box navbarMessage = null then
            None
          else
            Some navbarMessage

        return { Message = msg }
      }
