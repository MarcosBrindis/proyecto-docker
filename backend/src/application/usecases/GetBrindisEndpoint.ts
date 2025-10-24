export class GetBrindisEndpointUseCase {
  execute(): { nombreCompleto: string; mensaje: string; timestamp: Date } {
    return {
      nombreCompleto: "Marcos Brindis",
      mensaje: "Endpoint personalizado de Marcos Brindis",
      timestamp: new Date()
    };
  }
}