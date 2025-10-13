import { GraphQLError } from 'graphql';
import { supabase } from '../../lib/supabase';
import { calculateTotalPrice } from '../../utils/bookings';

export const bookingResolvers = {
  Query: {
    bookings: async (_, { filter }, { user }) => {
      if (!user) throw new GraphQLError('Authentication required');

      let query = supabase
        .from('bookings')
        .select(`
          *,
          property:properties(*),
          user:users(*)
        `)
        .eq('user_id', user.id);

      if (filter?.status) {
        query = query.eq('status', filter.status);
      }

      if (filter?.fromDate) {
        query = query.gte('check_in', filter.fromDate);
      }

      if (filter?.toDate) {
        query = query.lte('check_out', filter.toDate);
      }

      const { data, error } = await query;
      if (error) throw new GraphQLError('Failed to fetch bookings');
      return data;
    },

    booking: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError('Authentication required');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          property:properties(*),
          user:users(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw new GraphQLError('Booking not found');
      return data;
    },
  },

  Mutation: {
    createBooking: async (_, { input }, { user }) => {
      if (!user) throw new GraphQLError('Authentication required');

      const { propertyId, checkIn, checkOut } = input;

      // Vérifier la disponibilité
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('property_id', propertyId)
        .neq('status', 'cancelled')
        .or(`check_in.lte.${checkOut},check_out.gte.${checkIn}`);

      if (existingBookings?.length) {
        throw new GraphQLError('Property not available for these dates');
      }

      // Calculer le prix total
      const totalPrice = await calculateTotalPrice(propertyId, checkIn, checkOut);

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          property_id: propertyId,
          user_id: user.id,
          check_in: checkIn,
          check_out: checkOut,
          total_price: totalPrice,
        })
        .select()
        .single();

      if (error) throw new GraphQLError('Failed to create booking');
      return data;
    },

    updateBooking: async (_, { id, input }, { user }) => {
      if (!user) throw new GraphQLError('Authentication required');

      const { data, error } = await supabase
        .from('bookings')
        .update(input)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw new GraphQLError('Failed to update booking');
      return data;
    },

    cancelBooking: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError('Authentication required');

      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw new GraphQLError('Failed to cancel booking');
      return data;
    },
  },
};