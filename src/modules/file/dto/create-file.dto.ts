import { IsNotEmpty, IsString } from 'class-validator';

class CreateFileDto {
  @IsNotEmpty()
  @IsString()
  readonly url: string;

  @IsNotEmpty()
  @IsString()
  readonly path: string;
}

export default CreateFileDto;
