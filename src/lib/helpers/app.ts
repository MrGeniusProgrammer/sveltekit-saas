import type pino from 'pino';

export interface AppLoggerContext {
	logger: pino.Logger;
}
