import { Request, Response } from 'express';
import { AuthDomainService } from '../../../domain/service/authDomainService';
import { AuthAppService } from '../authAppService';

const authDomainServiceMock: Partial<AuthDomainService> = {
    login: jest.fn()
};

jest.mock('../../../domain/service/authDomainService', () => {
    return jest.fn().mockImplementation(() => {
        return authDomainServiceMock;
    })
})

describe("auth app service", () => {
    let authAppService: AuthAppService;
    let request: Request;
    let response: Response;

    beforeEach(() => {
        jest.clearAllMocks();
        authAppService = new AuthAppService(authDomainServiceMock as AuthDomainService);

        request = {
            body: {
                "email": "john.doe@example.com",
                "password": "password"
            }
        } as unknown as Request;

        response = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        } as unknown as Response;
    });

    test("login succesfully -> returns 200", async () => {
        (authAppService.authDomainService.login as jest.Mock).mockResolvedValue(response)
        await authAppService.login(request, response)

        expect(authDomainServiceMock.login).toHaveBeenCalledWith(
            'john.doe@example.com',
            'password',
            response
        )
        expect(authDomainServiceMock.login).resolves;
        expect(response.status).not.toHaveBeenCalled();
        expect(response.send).not.toHaveBeenCalled();
    })

    test("login but some fields are missing -> returns 400", async () => {
        request.body = {
            "email": "john.doe@example.com"
        };

        await authAppService.login(request, response)

        expect(authDomainServiceMock.login).not.toHaveBeenCalled();
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalled();
    })
})