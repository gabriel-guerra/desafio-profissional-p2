import { HttpException, HttpStatus } from "@nestjs/common";

export class NotUpdatedException extends HttpException {
    constructor() {
      super('Erro ao atualizar o registro', HttpStatus.BAD_REQUEST);
    }
  }