import { IsNotEmpty, IsString } from 'class-validator';

class UpdateFileDto {
  @IsNotEmpty()
  @IsString()
  readonly url: string;

  @IsNotEmpty()
  @IsString()
  readonly path: string;
}

export default UpdateFileDto;
