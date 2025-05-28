import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoUploadService implements OnModuleInit {
  private client: MongoClient;
  private bucket: GridFSBucket;
  private vaultAddr: string;
  private vaultToken: string;
  private vaultKey: string;

  constructor(private readonly configService: ConfigService) {
    this.vaultAddr = this.configService.get<string>('VAULT_ADDR', 'https://vaultdr.gsstvl.com');
    this.vaultToken = this.configService.get<string>('VAULT_TOKEN'); // Store this in .env
    this.vaultKey = this.configService.get<string>('VAULT_KEY', 'torus9x-cmk');
  }

  async onModuleInit() {
    this.client = new MongoClient('mongodb://admin:Torus%40123@192.168.2.165:32017/?directConnection=true&authSource=admin');
    await this.client.connect();
    const db = this.client.db('mongodb-upload');
    this.bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  }

  private async encryptData(buffer: Buffer): Promise<string> {
    const base64Plaintext = buffer.toString('base64');
    interface VaultEncryptResponse {
      data: {
        ciphertext: string;
      };
    }
    const res = await axios.post<VaultEncryptResponse>(
      `${this.vaultAddr}/v1/transit/encrypt/${this.vaultKey}`,
      { plaintext: base64Plaintext },
      {
        headers: {
          'X-Vault-Token': this.vaultToken,
        },
      },
    );
    return res.data.data.ciphertext;
  }

  private async decryptData(ciphertext: string): Promise<Buffer> {
    interface VaultDecryptResponse {
      data: {
        plaintext: string;
      };
    }
    const res = await axios.post<VaultDecryptResponse>(
      `${this.vaultAddr}/v1/transit/decrypt/${this.vaultKey}`,
      { ciphertext },
      {
        headers: {
          'X-Vault-Token': this.vaultToken,
        },
      },
    );
    return Buffer.from(res.data.data.plaintext, 'base64');
  }

  async uploadFile(file: Express.Multer.File) {
    const encrypted = await this.encryptData(file.buffer);
    const uploadStream = this.bucket.openUploadStream(file.originalname, {
      metadata: { isEncrypted: true },
    });
    uploadStream.end(Buffer.from(encrypted)); // ciphertext stored as Buffer
    return { message: 'Encrypted file uploaded successfully', fileId: uploadStream.id };
  }

  async getFile(id: string) {
    const chunks: Buffer[] = [];
    const downloadStream = this.bucket.openDownloadStream(new ObjectId(id));

    return new Promise<Buffer>((resolve, reject) => {
      downloadStream.on('data', (chunk) => chunks.push(chunk));
      downloadStream.on('end', async () => {
        const ciphertext = Buffer.concat(chunks).toString(); // assumes ciphertext is stored as Buffer string
        try {
          const decrypted = await this.decryptData(ciphertext);
          resolve(decrypted);
        } catch (err) {
          reject(err);
        }
      });
      downloadStream.on('error', reject);
    });
  }

  async deleteFile(id: string) {
    await this.bucket.delete(new ObjectId(id));
    return { message: 'File deleted successfully' };
  }

  async listFiles() {
    return this.bucket.find().toArray();
  }
}
